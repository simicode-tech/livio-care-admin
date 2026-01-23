import { FC, Fragment, PropsWithChildren } from "react";

type ToggleVisibilityProps = PropsWithChildren<{
  isVisible?: boolean;
  as?: FC;
  useAuthenticate?: boolean;
}>;

const ToggleVisibility = ({
  children,
  isVisible,
  as,
  ...props
}: ToggleVisibilityProps) => {
  const Component = as ? as : Fragment;

  if (!isVisible) return;

  return <Component {...props}>{children}</Component>;
};

export default ToggleVisibility;