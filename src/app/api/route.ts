import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { seasonaireEmail, seasonaireName, chaletName, date, time } = await req.json();

    if (!seasonaireEmail || !seasonaireName || !chaletName || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const formattedDate = new Date(date + "T00:00").toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long",
    });

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #11203a;">Your interview has been booked! 🎿</h2>
        <p>Hi ${seasonaireName},</p>
        <p><strong>${chaletName}</strong> has booked an interview with you.</p>
        <div style="background: #f8f5ef; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #5b6472;">Date</p>
          <p style="margin: 4px 0 12px; color: #11203a; font-weight: 600;">${formattedDate}</p>
          <p style="margin: 0; color: #5b6472;">Time</p>
          <p style="margin: 4px 0 0; color: #11203a; font-weight: 600;">${time}</p>
        </div>
        <p>Good luck! Log in to your dashboard for more details.</p>
        <p style="color: #8d95a3; font-size: 12px; margin-top: 32px;">YourSkiSeason</p>
      </div>
    `;

    const send = async (to: string[], subject: string) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "YourSkiSeason <noreply@your-ski-season.co.uk>",
          reply_to: "yourskiseason@gmail.com",
          to,
          subject,
          html: emailHtml,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
    };

    // Email to the seasonaire
    await send([seasonaireEmail], "Your interview has been booked!");

    // Copy to yourselves
    await send(["yourskiseason@gmail.com"], `Interview booked: ${seasonaireName} with ${chaletName}`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Email send failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
