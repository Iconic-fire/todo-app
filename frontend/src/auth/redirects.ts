let _navigate: ((to: string, options?: { replace?: boolean }) => void) | null = null;

export const setNavigate = (navFn: typeof _navigate) => {
  _navigate = navFn;
};

export const redirectToLogin = () => {
  if (_navigate) {
    _navigate("/login", { replace: true });
  } else {
    // fallback if navigate not set
    window.location.href = "/login";
  }
};
