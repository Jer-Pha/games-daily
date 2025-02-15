export async function onRequestGet(context) {
  try {
    const { request, env, params } = context;
    const path = params.path.join("/"); // Get the full path
    const object = await env.MEDIA.get(path);

    if (!object) {
      return new Response(null, { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);

    return new Response(object.body, {
      headers,
    });
  } catch (e) {
    console.error(e);
    return new Response(null, { status: 500 });
  }
}
