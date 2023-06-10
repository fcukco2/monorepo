import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

const USDC_BIG_HOLDER = "0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245"

describe("CO2Burner", function () {

  async function deployRegistry() {
    const owner = (await ethers.getSigners())[0];
    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    const usdc = await ethers.getContractAt("IERC20", usdcAddress);
    const t0 = "0x62896F42CF1371B268Db56E50D67C34F3eb1aD7a"
    const t1 = "0xB8802C009dd265B38E320214a7720EBd7A488827"
    const nctAddress = "0xD838290e877E0188a4A44700463419ED96c16107"
    const susiAddress = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"


    await registry.addAllProjectTokens([t0, t1])
    await registry.addProjectTokenByCountry("PL", [t1])
    await registry.addProjectTokenByCategory("NTR", [t0])

    const CO2Burner = await ethers.getContractFactory("CO2Burner");
    const co2Burner = await CO2Burner.deploy(registry.address, usdcAddress, nctAddress, susiAddress);

    const impersonatedSigner = await ethers.getImpersonatedSigner(USDC_BIG_HOLDER)
    await usdc.connect(impersonatedSigner).transfer(owner.address, ethers.utils.parseUnits("1000000", 6))
    await usdc.connect(owner).approve(co2Burner.address, ethers.constants.MaxUint256)

    return {registry, co2Burner, owner, usdc, t0, t1};
  }

  describe("Smoke test", function () {
    it("Should have an registry and stablecoin", async function () {
      const {registry, usdc, co2Burner} = await loadFixture(deployRegistry);
      expect(await co2Burner.registry()).to.equal(registry.address);
      expect(await co2Burner.stablecoin()).to.equal(usdc.address);
    });
  });

  describe("Burn test", function () {
    it("User should be able to buy and retire specified tco2 with a small amount of usdc", async function () {
      const {registry, usdc, co2Burner, t0, owner} = await loadFixture(deployRegistry);
      await expect(co2Burner.burnProjectToken(t0, ethers.utils.parseUnits("1", 6))).to.emit(co2Burner, "Retired").withArgs(
        owner.address,
        t0,
        "54133266591203315061",
        ethers.utils.parseUnits("1", 6),
      )
    });

    it("User should be able to buy and retire specified tco2 with a big amount of usdc", async function () {
      const {registry, usdc, co2Burner, t0, owner} = await loadFixture(deployRegistry);

      const tco2BurnedExpected = "13245634030000743084483"
      const usdcBurnedExpected = "25822452520"
      const quote = await co2Burner.burnProjectTokenQuote(t0, ethers.utils.parseUnits("100000", 6))
      expect(quote[0]).to.equal(tco2BurnedExpected)
      expect(quote[1]).to.equal(usdcBurnedExpected)

      await expect(co2Burner.burnProjectToken(t0, ethers.utils.parseUnits("100000", 6))).to.emit(co2Burner, "Retired").withArgs(
        owner.address,
        t0,
        tco2BurnedExpected,
        usdcBurnedExpected,
      )
    });

    it("User should be able to buy and retire tco2 based of filter", async function () {
      const {registry, usdc, co2Burner, t0, owner} = await loadFixture(deployRegistry);
      const tco2BurnedExpected = "13245634030000743084483"
      const usdcBurnedExpected = "25822452520"
      const usdcToBurn = ethers.utils.parseUnits("100000", 6)

      await expect(co2Burner.burnCO2(usdcToBurn, "")).to.emit(co2Burner, "Retired").withArgs(
        owner.address,
        t0,
        tco2BurnedExpected,
        usdcBurnedExpected,
      )
    });


  });




});
