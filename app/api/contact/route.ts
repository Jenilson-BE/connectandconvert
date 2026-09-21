import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const serverContactSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  businessName: z.string().min(2, "Business name is required."),
  email: z.string().email("Valid email is required."),
  phone: z.string().min(10, "Valid phone number is required."),
  services: z.array(z.string()).min(1, "At least one service is required."),
  businessWebsite: z.string().optional().or(z.literal("")),
  marketingGoals: z.string().min(10, "Marketing goals description is required."),
  budgetRange: z.string().optional().or(z.literal("")),
  additionalMessage: z.string().optional().or(z.literal("")),
  honeypot: z.string().max(0, "Bot submission rejected").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate payload with Zod
    const validationResult = serverContactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 2. Honeypot check (anti-spam)
    if (data.honeypot && data.honeypot.length > 0) {
      // Silently reject bots
      return NextResponse.json(
        { success: true, message: "Inquiry received." },
        { status: 200 }
      );
    }

    // 3. Integration boundary check
    // Supported providers: Resend / SMTP / Webhook via environment variables
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "hello@connectandconvert.tech";
    const webhookEndpoint = process.env.LEAD_WEBHOOK_URL;

    console.log("=========================================");
    console.log("📥 NEW INQUIRY RECEIVED [Connect & Convert]");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Name:", data.fullName);
    console.log("Business:", data.businessName);
    console.log("Email:", data.email);
    console.log("Phone:", data.phone);
    console.log("Services:", data.services.join(", "));
    console.log("Goals:", data.marketingGoals);
    console.log("Budget:", data.budgetRange || "Not specified");
    console.log("Website:", data.businessWebsite || "Not provided");
    console.log("Message:", data.additionalMessage || "None");
    console.log("=========================================");

    // Webhook dispatch if configured
    if (webhookEndpoint) {
      try {
        await fetch(webhookEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            submittedAt: new Date().toISOString(),
            source: "connectandconvert.tech/contact",
          }),
        });
      } catch (webhookErr) {
        console.error("Webhook dispatch warning:", webhookErr);
      }
    }

    // Optional email dispatch if RESEND_API_KEY is configured
    let emailDispatched = false;
    if (resendApiKey) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Connect & Convert Leads <inquiries@connectandconvert.tech>",
            to: [notificationEmail],
            reply_to: data.email,
            subject: `New Lead: ${data.fullName} — ${data.businessName}`,
            text: `
Name: ${data.fullName}
Business: ${data.businessName}
Email: ${data.email}
Phone: ${data.phone}
Services: ${data.services.join(", ")}
Budget: ${data.budgetRange || "Not specified"}
Website: ${data.businessWebsite || "Not specified"}
Goals: ${data.marketingGoals}
Additional Context: ${data.additionalMessage || "None"}
            `,
          }),
        });
        if (resendResponse.ok) {
          emailDispatched = true;
        }
      } catch (emailErr) {
        console.error("Resend delivery warning:", emailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for reaching out to Connect & Convert. We've received your inquiry and will review the details.",
        delivery: {
          recorded: true,
          emailDispatched,
          providerConfigured: Boolean(resendApiKey || webhookEndpoint),
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while processing your inquiry. Please try again or reach out on Telegram (@connectandconvert).",
      },
      { status: 500 }
    );
  }
}
