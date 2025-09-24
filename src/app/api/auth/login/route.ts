
export async function POST(req: Request) {
    return new Response(JSON.stringify({ message: "Dummy POST endpoint" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
