export async function generateAI(payload: any) {
  try {
    const res = await fetch("/api/generate-intelligence", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to generate");

    return res.json();
  } catch (err) {
    console.error(err);
    return { text: "Error generating output." };
  }
}
