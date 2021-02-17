// USER SIGN UP/IN

const apiEndpoint =
  process.env.NODE_ENV === "dev"
    ? "http://192.168.1.30"
    : "https://api.fltcmdr.com";

export default () => {
  return new Promise((resolve, reject) => {
    const profileApp = new Vue({
      el: "#authContainer",
      data: {
        message: "Hello Vue!",
        user: false,
        username: null,
        password: null,
        error: null,
        view: null,
        loading: false,
      },
      methods: {
        clearError: function () {
          if (this.error) {
            this.error = null;
          }
        },
        load: function (fast) {
          setTimeout(
            () => {
              this.loading = false;
              this.view.style.height = `100vh`;
              this.view.style.width = `100vw`;
              this.container.classList.add("hidden");
              const loadingText = document.getElementById("loading_text");
              loadingText.classList.remove("hidden");

              setTimeout(() => {
                resolve();
              }, 1200);
            },
            fast ? 0 : 2850
          );
        },
        signIn: function (ev) {
          ev.preventDefault();
          fetch(`${apiEndpoint}/users/signin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              callSign: this.username,
              password: this.password,
            }),
          })
            .then((res) => res.json())
            .then((jsonRes) => {
              const { error } = jsonRes;
              if (error) {
                this.error = `ERROR: ${error}`;
              } else {
                document.activeElement.blur();
                const { height, width } = this.view.getBoundingClientRect();
                this.view.style.height = `${height}px`;
                this.loading = true;
                this.container.style.width = "100%";
                this.view.style.width = `${height}px`;
                this.username = null;
                this.password = null;
                this.error = null;
                this.user = jsonRes.userRecord;
                localStorage.setItem("token", jsonRes.token);
                this.load();
              }
            });
        },
      },
      mounted: function () {
        this.view = document.getElementById("view");
        this.container = document.getElementById("authContainer");

        const { height, width } = this.view.getBoundingClientRect();
        this.view.style.width = `${width}px`;
        // this.load(true);
      },
    });
  });
};
