module.exports = (client, msg, args) => {
  const guild = msg.guild;
  const guildMembers = msg.guild.members;
  const roles = msg.guild.roles;
  const userRoles = msg.member.roles;

  let [roleName] = args;
  if (!roleName) return;
  const role = roles.find('name', roleName);
  if (!role) {
    const err = `${roleName} role does not exist! `;
    msg.reply(err);
    return;
  }

  if (role && userRoles.has(role.id)) {
    msg.member
      .removeRole(role)
      .then(() => {
        const message = `${roleName} role has been removed!`;
        msg.reply(message);
      })
      .catch(error => {
        const err = `${
          error.message === `Missing Permissions`
            ? `Remove Permissions not available for that role, sorry.`
            : error.message
        }`;
        msg.reply(err);
      });
  } else {
    msg.member
      .addRole(role)
      .then(() => {
        const message = `has been added to ${roleName} role!`;
        msg.reply(message);
      })
      .catch(error => {
        const err = `${
          error.message === `Missing Permissions`
            ? `Add Permissions not available for that role, sorry.`
            : error.message
        }`;
        msg.reply(err);
      });
  }

  // Check if they have one of many roles
  // if(message.member.roles.some(r=>["Dev", "Mod", "Server Staff", "Proficient"].includes(r.name)) ) {
  //   // has one of the roles
  // } else {
  //   // has none of the roles
  // }
  // console.log(msg.content[])
};
