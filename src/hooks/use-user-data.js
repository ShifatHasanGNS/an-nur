import { useState, useEffect } from "react";
import axios from "axios";

function useUserData(session) {
  const [userData, setUserData] = useState({
    name: "Guest",
    resultsCount: 0,
  });

  useEffect(() => {
    let isSubscribed = true;

    async function manageUser() {
      if (!session?.user?.email) {
        setUserData({ name: "Guest", resultsCount: 0 });
        return;
      }

      try {
        const response = await axios.get(
          `/api/users/info?email=${encodeURIComponent(session.user.email)}`
        );

        if (!isSubscribed) return;

        if (response.data?.user) {
          setUserData({
            name: response.data.user.name,
            resultsCount: response.data.user.resultsCount || 0,
          });
        }
      } catch (error) {
        if (!isSubscribed) return;

        if (error.response?.status === 404) {
          try {
            const registerResponse = await axios.post("/api/users/register", {
              email: session.user.email,
              name: session.user.name,
              avatar: session.user.image,
            });

            if (!isSubscribed) return;

            if (registerResponse.data?.user) {
              setUserData({
                name: registerResponse.data.user.name,
                resultsCount: 0,
              });
            }
          } catch (registerError) {
            console.error("Error registering user:", registerError);
          }
        }
      }
    }

    manageUser();

    // Listen for refresh-study-plans event to refetch user data
    function handleRefresh() {
      manageUser();
    }
    window.addEventListener("refresh-study-plans", handleRefresh);
    return () => {
      isSubscribed = false;
      window.removeEventListener("refresh-study-plans", handleRefresh);
    };
  }, [session?.user?.email, session?.user?.name, session?.user?.image]);

  return userData;
}

export { useUserData };
