exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    threadId: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"threads"',
      onDelete: "cascade",
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    date: {
      type: "VARCHAR",
      notNull: true,
      default: pgm.func("NOW()"),
    },
    isDelete: {
      type: "BOOLEAN",
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
