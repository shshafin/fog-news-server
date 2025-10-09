// cron/jobs.ts
import cron from "node-cron";
import { JobApplicationService } from "../../app/modules/job-application/job-application.service";

// Run every hour to retry failed emails
cron.schedule("0 * * * *", async () => {
  console.log("Running email retry job...");
  await JobApplicationService.retryFailedEmails();
  console.log("Email retry job completed");
});
