//https://www.youtube.com/watch?v=Acq9UEA2akU stopped at 3:55

import { initEdgeStore } from "@edgestore/server"
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app"

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
    myPublicImages: es.imageBucket(),
});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});

export { handler as GET, handler as POST};

export type EdgeStoreRouter = typeof edgeStoreRouter;