import { ResultSetHeader } from "mysql2";
import { db } from "../config/database";
import { Controller, Get, Param, BadRequestException, Post, Body, InternalServerErrorException } from "@nestjs/common";

@Controller("api/customers")
export class PostController {

  @Get(":customerId/posts")
  async getCustomerPosts(@Param("customerId") customerIdParam: string) {
    const customerId = Number(customerIdParam);

    if (Number.isNaN(customerId)) {
      throw new BadRequestException("Invalid customer ID");
    }

    const [rows] = await db.query(
      `SELECT p.post_id, p.price, p.description, p.address_line, p.city, p.state, p.zip_code, p.latitude, p.longitude, p.pickup_notes, p.delivery_instruction, p.has_driver, p.is_picked_up,
        (SELECT JSON_ARRAYAGG(pp.photo_url) FROM PostPhotos pp WHERE pp.post_id = p.post_id) AS photos,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('day_of_week', ta.day_of_week, 'start_time', ta.start_time,'end_time', ta.end_time)) FROM TimeAvailable ta WHERE ta.post_id = p.post_id) AS time_slots
      FROM Posts p
      WHERE p.posted_by = ?
      GROUP BY p.post_id
      ORDER BY p.post_id DESC`,
      [customerId]
    );

    const posts = (rows as any[]).map((row) => ({
      post_id: row.post_id,
      price: row.price,
      description: row.description,
      pickup_location: {
        address_line: row.address_line,
        city: row.city,
        state: row.state,
        zip_code: row.zip_code,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
      },
      pickup_notes: row.pickup_notes,
      time_slots: typeof row.time_slots === "string" ? JSON.parse(row.time_slots) : row.time_slots ?? [],
      photos: typeof row.photos === "string" ? JSON.parse(row.photos) : row.photos ?? [],
      delivery_instruction: row.delivery_instruction,
      status: row.is_picked_up
        ? "pickedUp"
        : row.has_driver
          ? "driverAccepted"
          : "findingDriver",
    }));

    return posts;
  }

  @Post(":customerId/posts")
  async createPost(@Param("customerId") customerIdParam: string, @Body() body: any,) {
    const customerId = Number(customerIdParam);

    if (Number.isNaN(customerId)) {
      throw new BadRequestException("Invalid customer ID");
    }

    console.log([
        customerId,
        body.price,
        body.description,
        body.address_line,
        body.city,
        body.state,
        body.zip_code,
        body.latitude,
        body.longitude,
        body.pickup_notes,
        body.delivery_instruction,
      ]);

    const {price, description, address_line, city, state, zip_code, latitude, longitude, pickup_notes, delivery_instruction, photos = [], time_slots = []} = body;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [postResult] =
        await connection.execute<ResultSetHeader>(
          `INSERT INTO Posts (posted_by, price, description, address_line, city, state, zip_code, latitude, longitude, 
            pickup_notes, delivery_instruction, has_driver, is_picked_up)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false, false)`,
          [
            customerId, price, description, address_line, city, state,
            zip_code, latitude, longitude, pickup_notes, delivery_instruction,
          ],
        );

      const postId = postResult.insertId;

      for (let i = 0; i < photos.length; i++) {
        await connection.execute(
          `
          INSERT INTO PostPhotos (post_id, photo_order, photo_url)
          VALUES (?, ?, ?)
          `,
          [postId, i, photos[i]],
        );
      }

      for (let i = 0; i < time_slots.length; i++) {
        const slot = time_slots[i];

        await connection.execute(
          `
          INSERT INTO TimeAvailable (time_id, post_id, day_of_week, start_time, end_time)
          VALUES (?, ?, ?, ?, ?)
          `,
          [i + 1, postId, slot.day_of_week, slot.start_time, slot.end_time],
        );
      }

      await connection.commit();

      return {
        message: "Post created successfully",
        post_id: postId,
      };
    } catch (error) {
      await connection.rollback();

      console.error("Error creating post:", error);

      throw new InternalServerErrorException(
        "Could not create post",
      );
    } finally {
      connection.release();
    }
  }
}