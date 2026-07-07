const SITE_DATA = {
  "alerts": {
    "message": "Welcome to Crystal Studios! Current version: 1.98 Beta.",
    "icon": "fa-solid fa-bullhorn",
    "enabled": true,
    "expiresAt": 1882939600000
  },
  "worlds": [
    {
      "id": "obsidian-ruins",
      "name": "Obsidian Ruins RPG",
      "category": "adventure",
      "icon": "fa-solid fa-dragon",
      "gradient": "from-fuchsia-900 to-amethyst-950",
      "tag": "",
      "tagColor": "",
      "badge": "Quest-driven",
      "badgeColor": "bg-fuchsia-950/50 border-fuchsia-800/30 text-fuchsia-400",
      "desc": "Search for lost Relics and defeat dungeon bosses in our highly themed open-world adventure roleplaying server layout.",
      "rating": "4.7",
      "joinCode": "obsidian-ruins",
      "createdBy": "mr_admin876",
      "isPlayerMade": false
    },
    {
      "id": "2456",
      "name": "School Boy Runaway",
      "category": "survival",
      "icon": "fa-solid fa-school",
      "gradient": "from-amber-900 to-orange-950",
      "tag": "",
      "tagColor": "",
      "badge": "Survival",
      "badgeColor": "bg-amber-950/50 border-amber-800/30 text-amber-400",
      "desc": " A Wonderful Game Of Teamwork And Hard Work Where You Try And Survive Your Parents. Can You Survive?",
      "rating": "5.0",
      "joinCode": "schoolboyranaway",
      "createdBy": "sticky_tape",
      "isPlayerMade": true
    },
    {
      "id": "warzone",
      "name": "WarZone",
      "category": "survival",
      "icon": "fa-solid fa-skull",
      "gradient": "from-emerald-900 to-teal-950",
      "tag": "",
      "tagColor": "",
      "badge": "Survival",
      "badgeColor": "bg-emerald-950/50 border-emerald-800/30 text-emerald-400",
      "desc": "Win fame and glory in this military war game. With multiple weapons, tools, ranks, and beautiful maps, this is the perfect shooting game!  COMING JULY 15",
      "rating": "4.5",
      "joinCode": "Coming Soon",
      "createdBy": "Entity1234",
      "isPlayerMade": false
    }
  ]
};


if (localStorage.getItem("cs_local_data")) {
    try {
        const localData = JSON.parse(localStorage.getItem("cs_local_data"));
        Object.assign(SITE_DATA, localData);
    } catch(e) { console.error("Error restoration local matrix", e); }
}
