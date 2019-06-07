import React from 'react';

export default function NotifCard(props) {
    return (
        <Card style={{width: 500, padding: 10}}>
            <Grid container spacing={2}>
                <Grid item style={{display: 'flex', alignItems: 'center'}}>
                    <Avatar 
                    alt='Arib Alam' 
                    src='/images/user-image.png'
                    style={{height: 60, width: 60}} />
                </Grid>
                <Grid item xs style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <Typography variant='body1'>{props.message}</Typography>
                    <Typography variant='caption'>{props.createdOn}</Typography>
                </Grid>
            </Grid>
        </Card>
    );
}



{/* <List>
          {SampleNotifs.map(item => {
                return(
                  <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                  primary={item.message}
                  secondary={
                      <React.Fragment>
                      <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                      >
                      {item.time}
                      </Typography>
                      </React.Fragment>
                      
                  }
                  />
                  </ListItem>

                )
              })
          }
    </List> */}