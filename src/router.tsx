import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Данные сайта меняются редко: не перезапрашиваем их при каждом переходе.
        staleTime: 5 * 60_000,
        gcTime: 30 * 60_000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Предзагрузка данных и чанка страницы при наведении/касании ссылки.
    defaultPreload: "intent",
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 0,
  });

  // Передаём данные запросов с сервера в браузер: иначе первый рендер в браузере
  // отличается от серверного и React сообщает об ошибке гидратации.
  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};
