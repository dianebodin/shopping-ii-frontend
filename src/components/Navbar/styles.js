import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  appBar: {
    boxShadow: 'none',
    backgroundColor: '#110066',
    color: 'white',
    borderBottom: '2px solid red',
  },
  title: {
    flexGrow: 1,
    alignItems: 'center',
    display: 'flex',
    textDecoration: 'none',
    height: '100px',
  },
  grow: {
    flexGrow: 1,
  },
}));