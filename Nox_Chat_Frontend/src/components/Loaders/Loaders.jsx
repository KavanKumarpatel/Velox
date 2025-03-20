import React from 'react'
import { Skeleton, Backdrop } from '@mui/material'

const Loaders = () => {
  return (
    <>
      <div>
        <Skeleton
          variant="rounded"
          height={"100vh"}
          width={"100vw"}
          sx={{ backgroundColor: "#212b36" }}
        />
        <div>
          <Skeleton
            variant="rounded"
            height={"100vh"}
            width={"50%"}
            sx={{ backgroundColor: "#454f5b" }}
          />
        </div>
          <Skeleton
            variant="rounded"
            height={"100vh"}
            width={"50%"}
            sx={{ backgroundColor: "#212b36" }}
          />
          <Backdrop open/>
      </div>
    </>
  );
}

export default Loaders