export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }

  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

//============================================

export const signup = (user) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const signin = (user) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const signout = (next) => {
  //if the window is NOT empty
  if (typeof window !== "undefined") localStorage.removeItem("jwt");
  //redirects user by executing the middleware passed in
  next();
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth/signout`, {
    method: "GET",
  })
    .then((response) => {
      // console.log("signout", response);
      return response.json();
    })
    .catch((err) => console.log(err));
};