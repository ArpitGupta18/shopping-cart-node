import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<CartProvider>
				<OrderProvider>
					<App />
				</OrderProvider>
			</CartProvider>
		</AuthProvider>
	</StrictMode>
);
