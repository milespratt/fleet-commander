// USER SIGN UP/IN

const apiEndpoint =
  process.env.NODE_ENV === "dev"
    ? "http://192.168.1.30"
    : "https://api.fltcmdr.com";

// var profileApp = new Vue({
//   el: "#profile-window",
//   data: {
//     message: "Hello Vue!",
//     user: false,
//     username: null,
//     password: null,
//     error: null,
//   },
//   methods: {
//     clearError: function () {
//       if (this.error) {
//         this.error = null;
//       }
//     },
//     signIn: function (ev) {
//       ev.preventDefault();
//       fetch(`${apiEndpoint}/users/signin`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           callSign: this.username,
//           password: this.password,
//         }),
//       })
//         .then((res) => res.json())
//         .then((jsonRes) => {
//           const { error } = jsonRes;
//           if (error) {
//             this.error = `ERROR: ${error}`;
//           } else {
//             document.activeElement.blur();
//             this.username = null;
//             this.password = null;
//             this.error = null;
//             this.user = jsonRes.userRecord;
//             localStorage.setItem("token", jsonRes.token);
//           }
//         });
//     },
//   },
// });
