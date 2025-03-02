import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {  Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar';
const Skeletons = () => {
  return (
    <>
   <Box >
      <Skeleton />
      <Skeleton animation="wave" />
    </Box>
    <Grid container>
        <Grid item xs={6} md ={2} direction={"row"} >
        <Skeleton variant="circular">
              <Avatar />
         </Skeleton>
          </Grid>
          <Grid item xs={6} md ={2} direction={"row"} >
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
        </Grid>

    </Grid>
    <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" width="100%">
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
        </Grid>
        <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" width="100%">
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
        </Grid>
        <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" width="100%">
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
        </Grid>
        <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" width="100%">
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
        </Grid>
        <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" width="100%">
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
        </Grid>
        <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" width="100%">
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
        </Grid>
    </Grid>
    </>
  )
}

export default Skeletons