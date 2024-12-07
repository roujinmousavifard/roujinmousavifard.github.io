async function fetchVisitorDataAndPost(postUrl, retries = 5, delay = 1000) {
  try {
    // Fetch visitor data from ipapi.co
    // console.log('Fetching visitor data...');
    let visitorData2 = { timezone: "Not available" };
    const fetchResponse = await fetch("https://get.geojs.io/v1/ip/geo.json");
    if (!fetchResponse.ok) {
      // throw new Error(`Failed to fetch visitor data: ${fetchResponse.statusText}`);
    } else {
      visitorData2 = await fetchResponse.json();
    }
    const visitorData = visitorData2;
    // console.log('Visitor data fetched:', visitorData);
    try {
      visitorData.accuracy = visitorData.accuracy + "  " + document.title;
    } catch {
      console.log("NO ac");
    }
    // Retry POST request
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempt ${attempt} to POST visitor data...`);
        const postResponse = await fetch(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitorData),
        });

        // Debug response status
        console.log(`POST Response Status: ${postResponse.status}`);

        if (postResponse.ok) {
          const result = await postResponse.json();
          console.log("Data successfully sent:", result);
          return result; // Exit on success
        } else {
          const errorText = await postResponse.text();
          console.warn(
            `POST attempt ${attempt} failed. Status: ${postResponse.status}. Response: ${errorText}`
          );
        }
      } catch (postError) {
        console.error(
          `POST attempt ${attempt} encountered an error:`,
          postError.message
        );
      }

      // Wait before retrying
      if (attempt < retries) {
        console.log(`Retrying POST in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error("Failed to POST visitor data after multiple attempts.");
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // Propagate the error to the caller
  }
}

// Usage
fetchVisitorDataAndPost("https://elcarad.com/test/add-roj-data")
  .then((result) => {
    console.log("Final success:", result);
  })
  .catch((error) => {
    console.error("Final error:", error.message);
  });
