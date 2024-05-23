// import React, { FC, ReactNode } from "react";

// type ProviderProps = {
//   children: ReactNode;
// };

// const combineProviders = (
//   providers: React.ComponentType<ProviderProps>[]
// ): FC<ProviderProps> => {
//   const CombinedProviders: FC<ProviderProps> = ({ children }) => {
//     return (
//       <>
//         {providers.map((Provider, index) => (
//           <Provider key={index}>{children}</Provider>
//         ))}
//       </>
//     );
//   };

//   return CombinedProviders;
// };

// export default combineProviders;

import { FC, PropsWithChildren } from "react";

type Provider = FC<PropsWithChildren<{}>>;

const combineProviders = (providers: Provider[]): FC => {
  return providers.reduce<FC<PropsWithChildren<{}>>>(
    (Combined, Provider) =>
      ({ children }) =>
        (
          <Combined>
            <Provider>{children}</Provider>
          </Combined>
        ),
    ({ children }) => <>{children}</>
  );
};

export default combineProviders;
