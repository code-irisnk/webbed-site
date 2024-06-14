export async function onRequest(context) {
    const commitSha = context.env.COMMIT_SHA; // Retrieve the commit SHA from the environment variable
    return new Response(JSON.stringify({ sha: commitSha }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
