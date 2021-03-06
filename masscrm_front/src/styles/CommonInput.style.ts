import { createStyles, makeStyles } from '@material-ui/core';

export const inputStyle = makeStyles(() =>
  createStyles({
    input: {
      color: '#939BB2',
      position: 'relative',
      '& .MuiOutlinedInput-root': {
        width: '100%',
        minHeight: '40px',
        border: 'solid 1px #E1E5ED',
        overflow: 'hidden',
        '&:hover': {
          borderColor: '#B6BECF'
        }
      },
      '& .MuiOutlinedInput-root.Mui-focused': {
        borderColor: '#B6BECF'
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px',
        fontSize: '14px',
        lineHeight: '16px'
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
      },
      '& .MuiIconButton-root': {
        padding: '6px'
      },
      '& .MuiInputLabel-outlined': {
        transform: 'translate(14px, 14px) scale(1)',
        color: '#939BB2',
        background: '#fff',
        padding: '0 3px'
      },
      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -4px) scale(1)',
        fontSize: '0.85em'
      }
    },
    inputError: {
      '& .MuiOutlinedInput-root': {
        borderColor: '#FD5757'
      }
    },
    inputRequire: {
      '& .MuiInputLabel-outlined::before': {
        content: '"*"'
      }
    },
    error: {
      color: '#FD5757',
      marginTop: '4px',
      fontSize: '0.85em',
      position: 'absolute'
    }
  })
);
