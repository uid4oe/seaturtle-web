import React from 'react';

import CommandItem from './CommandItem';

import {Feed} from 'semantic-ui-react';

const CommandList = ({
   commands, onClearCommand, onCancelCommand,
}) => (
  <Feed>
    {commands.map(command => (
      <CommandItem
        key={command.uid}
        demo = {command.uid}
        command={command}
        onClearCommand={onClearCommand}
        onCancelCommand={onCancelCommand}
      />
    ))}
  </Feed>
);

export default CommandList;
