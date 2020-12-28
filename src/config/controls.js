const controls = {
  categories: [
    {
      name: "Information",
      controls: [
        { name: "Sector", windowID: "sector-window", icon: "fa-vector-square" },
        {
          name: "Solar System",
          windowID: "solar-system-window",
          icon: "fa-solar-system",
        },
        { name: "Star", windowID: "star-window", icon: "fa-sun" },
        { name: "Planet", windowID: "planet-window", icon: "fa-planet-moon" },
        { name: "Ship", windowID: "ship-window", icon: "fa-starfighter" },
        {
          name: "Encyclopedia",
          windowID: "encyclopedia-window",
          icon: "fa-book",
        },
      ],
    },
    {
      name: "Communication",
      controls: [
        { name: "Chat", windowID: "chat-window", icon: "fa-comments-alt" },
        { name: "Mail", windowID: "mail-window", icon: "fa-mail-bulk" },
        { name: "Users", windowID: "users-window", icon: "fa-users" },
        { name: "Profile", windowID: "profile-window", icon: "fa-user" },
      ],
    },
    //     {
    //       name: "Utility",
    //       controls: [
    //         { name: "Toggle Grid", icon: "fa-border-all" },
    //         {
    //           name: "Toggle Windows",
    //           icon: "fa-window-restore",
    //         },
    //         {
    //           name: "Encyclopedia",
    //           windowID: "encyclopedia-window",
    //           icon: "fa-book",
    //         },
    //         { name: "Report Bug", icon: "fa-bug" },
    //         {
    //           name: "Request Feature",
    //
    //           icon: "fa-flask",
    //         },
    //       ],
    //     },
  ],
};

export default controls;
