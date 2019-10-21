import ResetPassword from '../components/Reset';

const Reset = (props) => {
  return (
    <div>
      Reset password: {props.query.resetToken}
      <ResetPassword resetToken={props.query.resetToken} />
    </div>
  )
}
export default Reset;