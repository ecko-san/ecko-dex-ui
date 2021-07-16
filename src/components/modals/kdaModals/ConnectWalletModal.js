import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/macro";

import CustomButton from "../../../shared/CustomButton";

import { AccountContext } from "../../../contexts/AccountContext";
import { WALLET } from "../../../constants/wallet";
import { ModalContext } from "../../../contexts/ModalContext";
import ConnectWalletZelcoreModal from "./ConnectWalletZelcoreModal";
import ConnecWalletTorusModal from "./ConnectWalletTorusModal";

const ConnectWalletModal = () => {
  const modalContext = useContext(ModalContext);
  const { account } = useContext(AccountContext);

  const [currentOpenWallet, setCurrentOpenWallet] = useState("");

  useEffect(() => {
    console.log(modalContext);
    // if (currentOpenWallet === "") modalContext.setModal("open", false);
  }, []);

  const openWalletModal = (walletName) => {
    switch (walletName) {
      default:
        return <div />;
      case "Zelcore":
        return modalContext.openModal({
          id: "ZELCORE",
          title: "connect wallet",
          description: "Zelcore Signing (Safest)",
          onBack: () => setCurrentOpenWallet(""),
          content: (
            <ConnectWalletZelcoreModal
              onClose={modalContext.closeModal()}
              onBack={() => setCurrentOpenWallet("")}
            />
          ),
        });
      case "Torus":
        return modalContext.openModal({
          id: "TORUS",
          title: "connect wallet",
          description: "Torus Signing",
          onBack: () => setCurrentOpenWallet(""),
          content: (
            <ConnecWalletTorusModal
              onClose={() => modalContext.closeModal()}
              onBack={() => setCurrentOpenWallet("")}
            />
          ),
        });
      case "Chainweaver":
        return <div />;
    }
  };

  return Object.values(WALLET).map((wallet, index) => (
    <CustomButton
      key={index}
      buttonStyle={{
        border: "1px solid #424242",
      }}
      background="transparent"
      onClick={() => {
        setCurrentOpenWallet(wallet.name);
        openWalletModal(wallet.name);
      }}
    >
      {wallet.logo}
      {` ${wallet.name}`}
    </CustomButton>
  ));
};

export default ConnectWalletModal;
