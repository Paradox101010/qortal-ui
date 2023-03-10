import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { doPageUrl } from '../redux/app/app-actions.js'
import { translate, translateUnsafeHTML } from 'lit-translate'

import '@material/mwc-icon'
import '@material/mwc-button'

class AppInfo extends connect(store)(LitElement) {
    static get properties() {
        return {
            blockInfo: { type: Object },
            nodeStatus: { type: Object },
            nodeInfo: { type: Object },
            nodeConfig: { type: Object },
            pageUrl: { type: String },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return [
            css`
                * {
                    --mdc-theme-primary: rgb(3, 169, 244);
                    --paper-input-container-focus-color: var(--mdc-theme-primary);
                }
                .normal {
                    --mdc-theme-primary: rgb(3, 169, 244);
                }

                .normal-button {
                    --mdc-theme-primary: rgb(3, 169, 244);
                    --mdc-theme-on-primary: white;
                }

                mwc-button.normal-button {
                    --mdc-theme-primary: rgb(3, 169, 244);
                    --mdc-theme-on-primary: white;
                }
                .test-net {
                    --mdc-theme-primary: black;
                }

                .test-net-button {
                    --mdc-theme-primary: black;
                    --mdc-theme-on-primary: white;
                }

                mwc-button.test-net-button {
                    --mdc-theme-primary: black;
                    --mdc-theme-on-primary: white;
                }
                #profileInMenu {
                    flex: 0 0 100px;
                    padding:12px;
                    border-top: 1px solid var(--border);
                    background: var(--sidetopbar);
                }
                .info {
                    margin: 0;
                    font-size: 14px;
                    font-weight:100;
                    display: inline-block;
                    width:100%;
                    padding-bottom:8px;
                    color: var(--black);
                }
                .blue {
                    color: #03a9f4;
                    margin: 0;
                    font-size: 14px;
                    font-weight:200;
                    display: inline;
                }
                .black {
                    color: var(--black);
                    margin: 0;
                    font-size: 14px;
                    font-weight:200;
                    display: inline;
                }
            `
        ]
    }

    constructor() {
        super()
        this.blockInfo = {}
        this.nodeInfo = {}
        this.nodeStatus = {}
        this.pageUrl = ''
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div id="profileInMenu">
                <span class="info">${translate("appinfo.blockheight")}: ${this.blockInfo.height ? this.blockInfo.height : ''}  <span class=${this.cssStatus}>${this._renderStatus()}</span></span>
                <span class="info">${translate("appinfo.uiversion")}: ${this.nodeConfig.version ? this.nodeConfig.version : ''}</span>
                ${this._renderCoreVersion()}
                <a id="pageLink"></a>
            </div>
        `
    }

    firstUpdated() {
    }

    _renderStatus() {
        if (this.nodeStatus.isMintingPossible === true && this.nodeStatus.isSynchronizing === true) {
            this.cssStatus = 'blue'
            return html`${translate("appinfo.minting")}`
        } else if (this.nodeStatus.isMintingPossible === true && this.nodeStatus.isSynchronizing === false) {
            this.cssStatus = 'blue'
            return html`${translate("appinfo.minting")}`
        } else if (this.nodeStatus.isMintingPossible === false && this.nodeStatus.isSynchronizing === true) {
            this.cssStatus = 'black'
            return html`(${translate("appinfo.synchronizing")}... ${this.nodeStatus.syncPercent !== undefined ? this.nodeStatus.syncPercent + '%' : ''})`
        } else if (this.nodeStatus.isMintingPossible === false && this.nodeStatus.isSynchronizing === false) {
            this.cssStatus = 'black'
            return ''
        } else {
            return ''
        }
    }

    _renderCoreVersion() {
        return html`<span class="info">${translate("appinfo.coreversion")}: ${this.nodeInfo.buildVersion ? this.nodeInfo.buildVersion : ''}</span>`
        setTimeout(_renderCoreVersion(), 60000)
    }

    gotoPage(url) {
        const myLink = this.shadowRoot.querySelector('#pageLink')
        myLink.href = url
        myLink.click()
        store.dispatch(doPageUrl(''))
    }

    stateChanged(state) {
        this.blockInfo = state.app.blockInfo
        this.nodeStatus = state.app.nodeStatus
        this.nodeInfo = state.app.nodeInfo
        this.nodeConfig = state.app.nodeConfig
        this.pageUrl = state.app.pageUrl
        if (this.pageUrl.length > 5) {
            this.gotoPage(this.pageUrl)
        }
    }
}

window.customElements.define('app-info', AppInfo)
