export const setSession = (authResult, cookies, history) => {
  const { token, expiresIn } = authResult;
  if (authResult && cookies && history && token) {
    const expiresAt = new Date((expiresIn * 1000) + new Date().getTime());
    cookies.set('token', token, {
      path: '/',
      expires: expiresAt,
    });
    history.replace('/profile');
  }
};
