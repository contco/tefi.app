import React from 'react'
import { Flex, Avatar, Button, Icon } from '@contco/core-ui'
import { ReactComponent as SunIcon } from '../dark-light-mode-icon.svg'

type Props = {
  profilePicture?: string
  name?: string
}

const Sidebar: React.FC<Props> = ({ name }) => {
  return (
    <Flex
      bg='left'
      flexDirection='column'
      pt='2.44%'
      justifyContent='space-between'
      alignItems='center'
      height='100vh'
      width='100px'
    >
      <Avatar title={name} size='md' name={name} color='white' />
      <Flex height='12%' width={1} justifyContent='center' aligItems='center'>
        <Button
          bg='white'
          height={15}
          width={5}
          style={{ borderRadius: '50%', border: '1px solid black' }}
          justifyContent='center'
        >
          <Flex alignItems='center'>
            <Icon svg={SunIcon}></Icon>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  )
}

export default Sidebar
