import { Injectable, OnModuleInit } from "@nestjs/common";
import cron from "node-cron";
import { db } from "../config/database";

@Injectable()
export class PostExpirationService implements OnModuleInit {
  onModuleInit() {
    // Runs every hour at minute 0
    cron.schedule("0 * * * *", () => {
      this.expirePosts();
    });
  }

  async expirePosts() {
    const [result] = await db.query(
      `
      UPDATE Posts
      SET post_status = 'expired'
      WHERE post_status = 'active'
        AND expires_at <= NOW()
      `,
    );

    console.log("Expired posts checked:", result);
  }
}