import React from 'react'
import { Button, Input, Flex, Box, Text, Heading } from '@contco/core-ui'

const Login = () => {
  return (
    <div>
      <Flex
        height='100vh'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
      >
        <Heading mb={4}>LOGIN PAGE</Heading>
        <Box mb={3}>
          <Input placeholder='Username' />
        </Box>
        <Box mb={3}>
          <Input placeholder='Password' type='password' />{' '}
        </Box>
        <Button color='white' style={{ cursor: 'pointer' }}>
          <Text mx={23} style={{color: "white"}}>
            LOGIN
          </Text>
        </Button>
      </Flex>
    </div>
  )
}

export default Login
