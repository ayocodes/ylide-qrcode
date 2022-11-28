import html2canvas from "html2canvas";
import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import styled from "styled-components";
import { colorOptions, gradientOptions } from "../components/ColorTheme";
import ellipsisAddress from "../utils/ellipsisAddress";

interface IColor {
  background: string;
}

interface IOperation {
  width: number;
}

const SBody = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
`;

const SMain = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 90vw;
  margin-top: 3.5rem;
`;

const SAppName = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  top: 1.2rem;
  left: 2rem;
  color: white;
  /* background: red; */
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
`;

const SBound = styled.div`
  width: 100%;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.18);
  border-radius: 25px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .8rem 3.5rem;
`;

const SForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 35vw;
  width: 100%;
  margin-right: 1rem;
`;

const STitle = styled.p`
  font-size: 1.05rem;
  padding-bottom: 5px;
`;

const STextInput = styled.input`
  height: 2.7rem;
  border: none;
  border-radius: 1rem;
  font-size: 16px;
  padding: 1rem;
  margin-bottom: .8rem;
  background: #535a83;
  resize: none;
  outline: none;
  color: white;
`;

const SButton = styled.div`
  display: grid;
  place-items: center;
  height: 2.7rem;
  width: 100%;
  color: white;
  font-size: .9rem;
  background: #15ff00;
  margin-top: .8rem;
  border-radius: 1rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
`;

const SQRBox = styled.div<IColor>`
  background: ${({ background }) => background};
  max-width: 17rem;
  width: 100%;
  height: 17rem;
  border-radius: 1rem;
  display: grid;
  place-items: center;
`;

const SOperations = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

const SColorBox = styled.div<IOperation>`
  width: ${({ width }) => `${width}rem`};
  height: 11rem;
  border-radius: 1.125rem;
  background: #1d1d1d;
  padding: .7rem;
  display: grid;
  place-items: center;
  gap: 0.7rem;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
`;

const SLogoBox = styled.div`
  width: 10.5rem;
  height: 11rem;
  border-radius: 1.125rem;
  background: #1d1d1d;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const SColor = styled.div<IColor>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ background }) => background};
  cursor: pointer;
`;

const SSelectBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 1rem 3rem;
`;

const SSelectOption = styled.div`
  width: 30vw;
  height: 16rem;
  background: #282e50;
  border-radius: 25px;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const SExportQR = styled.div<IColor>`
  background: ${({ background }) => background};
  z-index: -5000;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  position: fixed;
  justify-content: center;
  top: 0;
  left: 0;
  transform: translateX(-100%);  
  `;

const SBack = styled.div`
  background: rgba(255, 255, 255, 0.18);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;      
  `;

const SInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 3rem;
  background: linear-gradient(90deg, #313D48 -5%, #1D2227 108%);
  border-width: 1px 0px 0px 1px;
  border-style: solid;
  border-color: #404E5C;
  border-radius: 25px;
  padding: 1rem 0;
`

const SItem = styled.div`
  display: flex;
  padding:.5rem 3rem;
  width: 18rem;
`

const SImg = styled.img`
  width: 16px;
  margin-right: 1rem;
`

const Home: NextPage = () => {
  const [color, setColor] = useState(colorOptions[0]);
  const [gradientColor, setGradientColor] = useState(gradientOptions[0]);
  const [compose, setCompose] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [qrCodeURL, setQrCodeURL] = useState<HTMLCanvasElement>();
  const [logoSrc, setLogoSrc] = useState("/ylideIcon.svg")

  const panelRef = useRef<HTMLDivElement>(null);

  const captureImage = useCallback(async () => {
    const canvas = await html2canvas(panelRef.current!);
    setQrCodeURL(canvas);
    console.log(panelRef, canvas)
  }, [panelRef]);

  const handleLogo = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files as FileList)[0];

    var reader = new FileReader();
    reader.onload = function (event) {
      if (!event.target) return;
      const src = event.target.result as string;
      setLogoSrc(src)
    };
    reader.readAsDataURL(file);
  }, [panelRef]);

  const handleHome = () => {
    setShowOption(true)
    setWallet("")
    setName("")
    setSubject("")
  }

  const url = compose
    ? `https://mail.ylide.io/compose?type=address&address=${wallet}&input=${name}&subject=${subject}`
    : `https://mail.ylide.io/contacts?name=${name}&address=${wallet}`;
  // const url = compose
  //   ? `http://localhost:3000/compose?type=address&address=${wallet}&input=${name}&subject=${subject}`
  //   : `http://localhost:3000/contacts?name=${name}&address=${wallet}`;

  const qrCodeImage = () => {
    return (
      <SExportQR background={gradientColor} ref={panelRef}>
        <QRCode
          value={url}
          enableCORS={true}
          size={360}
          bgColor={"white"}
          fgColor={color}
          logoImage={logoSrc}
          logoWidth={60}
          removeQrCodeBehindLogo={true}
          qrStyle={"dots"}
          eyeRadius={[
            [20, 20, 0, 20],
            [20, 20, 20, 0],
            [20, 0, 20, 20],
          ]}
          eyeColor={color}
          quietZone={30}
        />
        <SInfo>
          {name && <SItem>
            <SImg src="/Name.svg" alt="" /><STitle> {name}</STitle>
          </SItem>}
          {wallet && <SItem>
            <SImg src="/Wallet.svg" alt="" /><STitle> {ellipsisAddress(wallet, 8)}</STitle>
          </SItem>}
          {subject && <SItem>
            <SImg src="/Subject.svg" alt="" /><STitle> {subject}</STitle>
          </SItem>}
        </SInfo>
      </SExportQR>
    );
  };

  return (
    <>
      <Head>
        <title>Ylide QR-Code</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SBody>
        {qrCodeImage()}

        <SAppName><SBack onClick={handleHome}></SBack> <p>Ylide QR-Code Generator</p> </SAppName>
        <SMain>
          {!showOption ? (
            <>
              <SBound>
                <SForm>

                  <STitle>Name</STitle>
                  <STextInput
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />

                  <STitle>Wallet ID</STitle>
                  <STextInput
                    onChange={(e) => setWallet(e.target.value)}
                    value={wallet}
                    required
                  />
                  {compose ? (
                    <>
                      <STitle>Subject</STitle>
                      <STextInput
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </>
                  ) : (
                    <></>
                  )}

                  <a
                    href={qrCodeURL && qrCodeURL.toDataURL("image/png")}
                    download="download"
                    onClick={captureImage}
                  >
                    <SButton>Download QR Code</SButton>
                  </a>
                </SForm>
                <SQRBox background={gradientColor} >
                  <QRCode
                    value={url}
                    enableCORS={true}
                    size={180}
                    bgColor={"white"}
                    fgColor={color}
                    logoImage={logoSrc}
                    logoWidth={30}
                    removeQrCodeBehindLogo={true}
                    qrStyle={"dots"}
                    eyeRadius={[
                      [20, 20, 0, 20],
                      [20, 20, 20, 0],
                      [20, 0, 20, 20],
                    ]}
                    eyeColor={color}
                  />
                </SQRBox>
              </SBound>
              <SBound>
                <SOperations>
                  <STitle>Color theme</STitle>
                  <SColorBox width={9}>
                    {colorOptions.map((color, i) => (
                      <SColor background={color} onClick={() => setColor(colorOptions[i])} key={i} />
                    ))}
                  </SColorBox>
                </SOperations>
                <SOperations>
                  <STitle>Background gradient</STitle>
                  <SColorBox width={13}>
                    {gradientOptions.map((color, i) => (
                      <SColor
                        key={i}
                        background={color}
                        onClick={() => setGradientColor(gradientOptions[i])} />
                    ))}
                  </SColorBox>
                </SOperations>
                <SOperations >
                  <STitle>Center logo</STitle>
                  <SLogoBox>
                    <img src={logoSrc} style={{ width: "100px", maxHeight: "100px" }} alt="" />
                    <SButton style={{ height: "2.25rem" }}>
                      <input type="file" id="logo" accept="image/*" hidden onChange={handleLogo} />
                      <label htmlFor="logo">Change</label>
                    </SButton>
                  </SLogoBox>
                </SOperations>
              </SBound>
            </>
          ) : (
            <>
              <STitle style={{ marginTop: "5rem" }}>
                What type of QR Code would you like to create
              </STitle>
              <SSelectBox>
                <SSelectOption
                  onClick={() => {
                    setShowOption(false);
                    setCompose(true);
                  }}
                >
                  <STitle>Compose a mail</STitle>
                </SSelectOption>
                <SSelectOption
                  onClick={() => {
                    setShowOption(false);
                    setCompose(false);
                  }}
                >
                  <STitle>Add to contact list</STitle>
                </SSelectOption>
              </SSelectBox>
            </>
          )}
        </SMain>
      </SBody>
    </>
  );
};

export default Home;
