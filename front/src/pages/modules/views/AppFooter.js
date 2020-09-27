import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import { useTranslation } from 'react-i18next';
import {
  LinkedIn,
  GitHub,
} from '@material-ui/icons';

import Typography from '../components/Typography';
import TextField from '../components/TextField';
import { classNames } from '../../../utils';

function Copyright() {
  return (
    <>
      {'© '}
      <Link color="inherit" href="/">
        Express POS
      </Link>
      {' '}
      {new Date().getFullYear()}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: 'flex',
  },
  icon: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  list: {
    margin: 0,
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  language: {
    marginTop: theme.spacing(1),
    width: 150,
  },
}));

const LANGUAGES = [
  {
    code: 'en-US',
    name: 'English',
  },
  {
    code: 'fr-FR',
    name: 'Français',
  },
  {
    code: 'zh-Hans',
    name: '中文',
  },
];

export default function AppFooter() {
  const classes = useStyles();
  const { i18n } = useTranslation();

  return (
    <>
      <Typography component="footer" className={classes.root}>
        <Container className={classes.container}>
          <Grid container spacing={5}>
            <Grid item xs={6} sm={4} md={3}>
              <Grid
                container
                direction="column"
                className={classNames([classes.iconsWrapper, 'icons'])}
                spacing={2}
              >
                <Grid item className={classNames([classes.icons, 'social-media'])}>
                  <a href="https://www.linkedin.com/in/sheng-x/" className={classes.icon}>
                    <LinkedIn />
                  </a>
                  <a
                    href="https://github.com/SHENG-X"
                    className={classes.icon}
                  >
                    <GitHub />
                  </a>
                </Grid>
                <Grid item>
                  <Copyright />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="h6" marked="left" gutterBottom>
                Legal
              </Typography>
              <ul className={classes.list}>
                <li className={classes.listItem}>
                  <Link href="/#/terms/">Terms</Link>
                </li>
                <li className={classes.listItem}>
                  <Link href="/#/privacy/">Privacy</Link>
                </li>
              </ul>
            </Grid>
            <Grid item xs={6} sm={8} md={4}>
              <Typography variant="h6" marked="left" gutterBottom>
                Language
              </Typography>
              <TextField
                size="medium"
                select
                SelectProps={{
                  native: true,
                }}
                className={classes.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                {LANGUAGES.map((language) => (
                  <option value={language.code} key={language.code}>
                    {language.name}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container>
            <Typography variant="caption" className="caption">
              Made with
              <i className="icon ion-heart" />
              By
              <Link
                href="https://github.com/SHENG-X"
                rel="sponsored"
                title="SHENG.X"
              >
                SHENG.X
              </Link>
            </Typography>
          </Grid>
        </Container>
      </Typography>
    </>
  );
}
