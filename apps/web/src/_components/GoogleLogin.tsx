export default function GoogleLoginButton() {
  return (
    <>
      <div id="g_id_onload"
        data-client_id="xxxxx"
        data-context="signin"
        data-ux_mode="redirect"
        data-login_uri="xxxx"
        data-auto_prompt="false">
      </div>
      <div className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left">
      </div>
    </>
  )
}
