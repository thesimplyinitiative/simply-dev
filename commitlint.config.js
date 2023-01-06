const {
  utils: { getProjects },
} = require('@commitlint/config-nx-scopes');

module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  plugins: [
    {
      rules: {
        jira: ({ subject }) => {
          const potentialTicket = ticketRegex.exec(subject);

          if (potentialTicket) {
            const ticket = potentialTicket[0];

            if (!subject.includes(`[${ticket}]`)) {
              return [
                false,
                `Jira ticket must be prepended with '[' and appended with ']' and not contain any white spaces. Example: [${ticket}]`,
              ];
            }
          } else if (!(subject.includes('[') && subject.includes(']'))) {
            return [true];
          } else {
            const startOfTicket = subject.indexOf('[');
            const endOfTicket = subject.indexOf(']', startOfTicket);

            const ticket = subject.substring(startOfTicket + 1, endOfTicket);

            if (ticket.trim() === '') {
              return [false, 'Jira ticket cannot be empty'];
            }
            if (ticket.toUpperCase() !== ticket) {
              return [false, 'The Jira ticket number must be uppercase'];
            } else if (ticketRegex.test(ticket)) {
              return [
                false,
                `Jira ticket must match ${/[A-Z]+-[0-9]+/}. Example: 'TEST-1234'`,
              ];
            }
          }

          return [true];
        },
      },
    },
  ],
  rules: {
    'scope-enum': async (ctx) => [
      2,
      'always',
      [...(await getProjects(ctx)), 'root'],
    ],
  },
};
