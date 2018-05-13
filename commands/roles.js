module.exports = (client, msg, args) => {
  const guild = msg.guild;
  const guildMembers = msg.guild.members;
  const roles = msg.guild.roles;
  const userRoles = msg.member.roles;
  const role = roles.find('name', 'Winston');

  const filteredRoles = roles.filter(r => {
    if (role && role.position && r.position < role.position && r.position !== 0 && !r.managed) {
      return r;
    }
  });

  let rolesAvailable = [];
  filteredRoles.forEach(r => {
    rolesAvailable.push({
      name: `${r.name}`,
      value: `**${r.members.size}** members`,
      inline: true,
    });
  });

  const embed = {
    embed: {
      color: 13369344,
      description:
        'The following roles are available to add to yourself using "**!role rolename**"',
      fields: rolesAvailable,
      footer: {
        text: 'Use "!role rolename", to give yourself a new role to view more chatrooms.',
      },
    },
  };

  msg.channel.send(embed);
};
