import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("Registry", function () {

  async function deployRegistry() {
    const owner = (await ethers.getSigners())[0];
    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    return {registry, owner};
  }

  describe("Smoke test", function () {
    it("Should have an owner", async function () {
      const {registry, owner} = await loadFixture(deployRegistry);
      expect(await registry.owner()).to.equal(owner.address);
    });
  });

  describe("Adding tokens", function () {

    it("Owner should be able to add all tokens", async function () {
      const {registry, owner} = await loadFixture(deployRegistry);
      const t0 = "0x62896F42CF1371B268Db56E50D67C34F3eb1aD7a"
      const t1 = "0xB8802C009dd265B38E320214a7720EBd7A488827"
      await registry.addAllProjectTokens([t0, t1])
      expect(await registry.allProjectTokens(0)).to.equal(t0);
      expect(await registry.allProjectTokens(1)).to.equal(t1);
    })

    it("Owner should be able to add tokens based on country", async function () {
      const {registry, owner} = await loadFixture(deployRegistry);
      const t0 = "0x62896F42CF1371B268Db56E50D67C34F3eb1aD7a"
      const t1 = "0xB8802C009dd265B38E320214a7720EBd7A488827"
      await registry.addProjectTokenByCountry("PL", [t0, t1])
      const projectTokens = await registry.getProjectTokenByCountry("PL");
      expect(projectTokens[0]).to.equal(t0);
      expect(projectTokens[1]).to.equal(t1);
    })

    it("Owner should be able to add tokens based on category", async function () {
      const {registry, owner} = await loadFixture(deployRegistry);
      const t0 = "0x62896F42CF1371B268Db56E50D67C34F3eb1aD7a"
      const t1 = "0xB8802C009dd265B38E320214a7720EBd7A488827"
      await registry.addProjectTokenByCategory("NTR", [t0, t1])
      const projectTokens = await registry.getProjectTokenByCategory("NTR");
      expect(projectTokens[0]).to.equal(t0);
      expect(projectTokens[1]).to.equal(t1);
    })

  });

  describe("Find the best tokens", function () {

    it("User should be able to see ordered tokens based on quality w/o filter", async function () {
      const {registry} = await loadFixture(deployRegistry);
      const t0 = "0x62896F42CF1371B268Db56E50D67C34F3eb1aD7a"
      const t1 = "0xB8802C009dd265B38E320214a7720EBd7A488827"
      await registry.addAllProjectTokens([t0, t1])
      const result = await registry.findBestProjectTokens("")
      expect(result[0]).to.equal(t0);
      expect(result[1]).to.equal(t1);
    })

    it("User should be able to see ordered tokens based on country", async function () {
      const {registry} = await loadFixture(deployRegistry);
      const t0 = "0x62896F42CF1371B268Db56E50D67C34F3eb1aD7a"
      const t1 = "0xB8802C009dd265B38E320214a7720EBd7A488827"
      await registry.addAllProjectTokens([t0, t1])
      await registry.addProjectTokenByCountry("PL", [t0])
      const result = await registry.findBestProjectTokens("PLXXX")
      expect(result.length).is.equal(1);
      expect(result[0]).to.equal(t0);
    })

    it("User should be able to see ordered tokens based on category", async function () {
      const {registry} = await loadFixture(deployRegistry);
      const t0 = "0x62896F42CF1371B268Db56E50D67C34F3eb1aD7a"
      const t1 = "0xB8802C009dd265B38E320214a7720EBd7A488827"
      await registry.addAllProjectTokens([t0, t1])
      await registry.addProjectTokenByCategory("NTR", [t0])
      const result = await registry.findBestProjectTokens("XXNTR")
      expect(result.length).is.equal(1);
      expect(result[0]).to.equal(t0);
    })

    it("User should be able to see ordered tokens based on country and category", async function () {
      const {registry} = await loadFixture(deployRegistry);
      const t0 = "0x62896F42CF1371B268Db56E50D67C34F3eb1aD7a"
      const t1 = "0xB8802C009dd265B38E320214a7720EBd7A488827"
      await registry.addAllProjectTokens([t0, t1])
      await registry.addProjectTokenByCountry("PL", [t0])
      await registry.addProjectTokenByCategory("NTR", [t0])
      const result = await registry.findBestProjectTokens("PLNTR")
      expect(result.length).is.equal(1);
      expect(result[0]).to.equal(t0);
    })

    it("User should receive empty list if no intersection", async function () {
      const {registry} = await loadFixture(deployRegistry);
      const t0 = "0x62896F42CF1371B268Db56E50D67C34F3eb1aD7a"
      const t1 = "0xB8802C009dd265B38E320214a7720EBd7A488827"
      await registry.addAllProjectTokens([t0, t1])
      await registry.addProjectTokenByCountry("PL", [t1])
      await registry.addProjectTokenByCategory("NTR", [t0])
      const result = await registry.findBestProjectTokens("PLNTR")
      expect(result.length).is.equal(0);
    })

  });


});
