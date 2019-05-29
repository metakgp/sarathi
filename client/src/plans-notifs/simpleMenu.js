import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Notifs from './notifs'


const SampleNotifs = [
  {
    message: 'x has agreed to join u from kgp to ccu vx has agreed to join u from kgp to ccu',
    time: '15 min ago'
  },
  {
    message: 'x has agreed to join u from kgp to ccu',
    time: '15 min ago'
  },
  {
    message: 'x has agreed to join u from kgp to ccu',
    time: '15 min ago'
  },
  
]


function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <Button
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        Notifications
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {
          SampleNotifs.map(item => {
            return(
              <MenuItem onClick={handleClose} disableGutters={true}>
                <Notifs NotifMessage={item.message} time={item.time} />
              </MenuItem> 
            )
          })
        }
      </Menu>
    </div>
  );
}

export default SimpleMenu;
