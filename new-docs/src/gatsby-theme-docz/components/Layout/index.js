/** @jsx jsx */
import { Global } from '@emotion/core'
import { MainContainer } from 'gatsby-theme-docz/src/components//MainContainer'
import { Sidebar } from 'gatsby-theme-docz/src/components//Sidebar'
import { Header } from 'gatsby-theme-docz/src/components/Header'
import * as styles from 'gatsby-theme-docz/src/components/Layout/styles'
import global from 'gatsby-theme-docz/src/theme/global'
import React, { useRef, useState } from 'react'
import { Layout as BaseLayout, Main, jsx } from 'theme-ui'

export const Layout = ({ children, pageContext: { frontmatter } }) => {
  const [open, setOpen] = useState(false)
  const nav = useRef()

  const { fullpage } = frontmatter;

  const content = fullpage
    ? children
    : (
        <React.Fragment>
          <Header onOpen={() => setOpen(s => !s)} />
          <div sx={styles.wrapper}>
            <Sidebar
              ref={nav}
              open={open}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              onClick={() => setOpen(false)}
            />
            <MainContainer data-testid="main-container">{children}</MainContainer>
          </div>
        </React.Fragment>
      )
  ;

  return (
    <BaseLayout sx={{ '& > div': { flex: '1 1 auto' } }} data-testid="layout">
      <Global styles={global} />
      <Main sx={styles.main}>
        { content }
      </Main>
    </BaseLayout>
  )
}