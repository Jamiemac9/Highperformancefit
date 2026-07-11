/**
 * SSR entry point for prerendering.
 * Exports a `render()` function that returns HTML string for a given URL.
 */
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

// Page components (imported as-is; Vite's @vitejs/plugin-react handles JSX)
import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";

const h = React.createElement;

export function render(url: string): string {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });

  // Pre-populate public packages so landing page renders cards
  queryClient.setQueryData(["packages", "public"], [
    { id:"prerender-starter", name:"Starter", type:"IN_PERSON", sessions:5, price:"250", pricePerSession:"50", description:"5 sessions — perfect to kick-start your fitness journey.", highlights:["5 1-on-1 sessions","Initial assessment & goal setting","Custom workout plan","Nutrition guidance"], isActive:true, featured:false, stripeLink:null },
    { id:"prerender-commitment", name:"Commitment", type:"IN_PERSON", sessions:10, price:"350", pricePerSession:"35", description:"10 sessions — the sweet spot for real momentum.", highlights:["10 1-on-1 sessions","Full body composition tracking","Weekly check-ins","Nutrition coaching"], isActive:true, featured:false, stripeLink:null },
    { id:"prerender-group", name:"Group", type:"GROUP", sessions:8, price:"200", pricePerSession:"25", description:"8 small-group sessions — train with friends, split the cost.", highlights:["8 group sessions","Up to 4 people","Shared programming","Team accountability"], isActive:true, featured:false, stripeLink:null },
    { id:"prerender-transformation", name:"Transformation", type:"IN_PERSON", sessions:24, price:"840", pricePerSession:"35", description:"24 sessions — complete body transformation over 12 weeks.", highlights:["24 1-on-1 sessions","Weekly progress photos","Full meal plan","Unlimited WhatsApp support"], isActive:true, featured:true, stripeLink:null },
  ]);

  let Page: any;
  if (url === "/" || url === "") Page = Landing;
  else if (url === "/login") Page = Login;
  else if (url === "/register") Page = Register;
  else Page = () => null;

  return renderToString(
    h(QueryClientProvider, { client: queryClient },
      h(AuthProvider, null,
        h(TooltipProvider, null,
          h(StaticRouter, { location: url },
            h(Page)
          ),
          h(Toaster, null)
        )
      )
    )
  );
}
