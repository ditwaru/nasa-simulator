const origin = 'http://localhost:3001';

// Load planets and return as JSON.
async function httpGetPlanets() {
  try {
    const response = await fetch(`${origin}/planets`);
    return await response.json();
  } catch (err) {
    console.log(err);
  }
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  try {
    const response = await fetch(`${origin}/launches`);
    return await response.json();
  } catch (err) {
    console.log(err);
  }
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${origin}/launches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${origin}/launches/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
