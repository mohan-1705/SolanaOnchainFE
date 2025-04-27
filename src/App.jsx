import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import ErrorPage from "./error-page";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import LandingPageComponent from "./components/LandingPageComponent.jsx";
import { ElkPage } from "./elkjs/ElkPage.jsx";
import { ReactFlowProvider } from "reactflow";
import { GlobalProvider } from "./context/GlobalContext";
import GetSSEData from "./utils/GetSSEData.jsx";
import UploadFile from "./elkjs/UploadFile.jsx";
import {TokenPage} from "./token/tokenPage.jsx";
import TokenHolder from "./token/TokenHolder";
import TokenTraders from "./token/tokenTraders";
import { TradersPage } from "./token/tradersPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageComponent />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/elkjs",
    element: <ElkPage />,
  },
  {
    path: "/token",
    element: <TokenPage/>,
  },
  {
    path: "/tokentraders",
    element: <TradersPage/>,
  },
  {
    path: "/token/:mint/holders",
    element: <TokenHolder />,
  },
  {
    path: "/token/:mint/traders",
    element: <TokenTraders />,
  },
  {
    path: "elkjs/:centralNodeAddress",
    element: <ElkPage />,
  },
  // {
  //   path: "sse",
  //   element: <GetSSEData />,
  // },
  {
    path: "/upload-graph",
    element: <UploadFile />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={import.meta.env.VITE_VERCEL_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_VERCEL_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <GlobalProvider>
      <NextUIProvider>
        <ReactFlowProvider>
          <RouterProvider router={router} />
        </ReactFlowProvider>
      </NextUIProvider>
    </GlobalProvider>
  </Auth0Provider>
);
