import { ResultSetHeader } from "mysql2";
import { db } from "../config/database";
import { Controller, Get, Param, BadRequestException, Post, Body, InternalServerErrorException, Patch } from "@nestjs/common";

@Controller("api/posts")
export class PostController {

  @Get("user/:userId")
  async getUserPosts(@Param("userId") userIdParam: string) {
    const userId = Number(userIdParam);

    if (Number.isNaN(userId)) {
      throw new BadRequestException("Invalid customer ID");
    }

    const [rows] = await db.query(
      `SELECT p.post_id, p.price, p.description, p.address_line, p.city, p.state, p.zip_code, p.latitude, p.longitude, p.pickup_notes, p.delivery_instruction, p.has_driver, p.is_picked_up,
        (SELECT JSON_ARRAYAGG(pp.photo_url) FROM PostPhotos pp WHERE pp.post_id = p.post_id) AS photos,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('day_of_week', ta.day_of_week, 'start_time', ta.start_time,'end_time', ta.end_time)) FROM TimeAvailable ta WHERE ta.post_id = p.post_id) AS time_slots
      FROM Posts p
      WHERE p.posted_by = ?
      ORDER BY p.post_id DESC`,
      [userId]
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

  @Get(":postId")
  async getPost(@Param("postId") postIdParam: string) {
    const postId = Number(postIdParam);

    const [rows] = await db.query<any[]>(
      `SELECT p.price, p.description, p.address_line, p.city, p.state, p.zip_code, p.pickup_notes, p.delivery_instruction,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('url', pp.photo_url,'publicId', pp.cloudinary_public_id)) FROM PostPhotos pp WHERE pp.post_id = p.post_id) AS photos,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('day_of_week', ta.day_of_week, 'start_time', ta.start_time,'end_time', ta.end_time)) FROM TimeAvailable ta WHERE ta.post_id = p.post_id) AS time_slots
      FROM Posts p
      WHERE p.post_id = ?
      LIMIT 1`,
      [postId],
    );

    return rows[0];
  }

  @Post("user/:userId")
  async createPost(@Param("userId") userIdParam: string, @Body() body: any,) {
    const userId = Number(userIdParam);

    if (Number.isNaN(userId)) {
      throw new BadRequestException("Invalid user ID");
    }

    console.log([
        userId,
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
            userId, price, description, address_line, city, state,
            zip_code, latitude, longitude, pickup_notes, delivery_instruction,
          ],
        );

      const postId = postResult.insertId;

      for (let i = 0; i < photos.length; i++) {
        await connection.execute(
          `
          INSERT INTO PostPhotos (post_id, photo_order, photo_url, cloudinary_public_id)
          VALUES (?, ?, ?, ?)
          `,
          [postId, i, photos[i].url, photos[i].publicId],
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

  @Patch(":postId")
  async updatePost(
    @Param("postId") postIdParam: string,
    @Body() body: any,
  ) {
    const postId = Number(postIdParam);

    await db.query(
      `
      UPDATE Posts
      SET price = ?, description = ?, address_line = ?, city = ?, state = ?, zip_code = ?, latitude = ?, longitude = ?, 
          pickup_notes = ?, delivery_instruction = ?
      WHERE post_id = ?
      `,
      [
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
        postId,
      ],
    );

    return { message: "Post updated successfully" };
  }
}