import { Grid, GridItem } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BookingGrid from "./components/BookingGrid";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthContext"; // Import AuthProvider
import travel from "./assets/travel.jpg";
import AboutUs from "./components/AboutUs"; // Import the AboutUs component
import OurServices from "./components/OurServices"; // Import the OurServices component
import Welcome from "./components/Welcome";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Grid
          templateAreas={{
            base: `"nav" "welcome" "main" "services" "about" "footer"`,
            lg: `"nav nav" "welcome welcome" "main main" "services services" "about about" "footer footer"`,
          }}
          minHeight="100vh"
          templateRows="auto auto 1fr auto auto auto"
        >
          {/* Navbar Section */}
          <GridItem area="nav" bg="">
            <NavBar />
          </GridItem>

          {/* Welcome Section */}
          <GridItem area="welcome" bg="gray.100">
            <Welcome />
          </GridItem>

          {/* Main Content Section (BookingGrid) */}
          <GridItem
            area="main"
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundImage={`url(${travel})`}
            backgroundPosition="center"
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            minHeight="80vh"
            id="booking-section" // Add ID for scrolling
          >
            <Routes>
              {/* BookingGrid Route */}
              <Route path="/" element={<BookingGrid />} />

              {/* Admin Dashboard Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </GridItem>

          {/* Our Services Section */}
          <GridItem area="services" bg="white">
            <OurServices />
          </GridItem>

          {/* About Us Section */}
          <GridItem area="about" bg="white">
            <AboutUs />
          </GridItem>

          {/* Footer Section */}
          <GridItem area="footer" bg="">
            <Footer />
          </GridItem>
        </Grid>
      </AuthProvider>
    </Router>
  );
}

export default App;