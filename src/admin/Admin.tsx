import {
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    withStyles
} from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import AppBar from "../components/AppBar/AppBar";
import SideBar from "../components/SideBar/SideBar";
import Dashboard from "./views/dashboard/Dashboard";
import CampaignsList from "./views/campaignsList/CampaignsList";

import CampaignNew from "../components/Campaigns/CampaignNew/CampaignNew";
import CreativesNew from "../components/Creatives/CreativesNew/CreativesNew";
import CreativeSetNew from "../components/CreativeSets/CreativeSetNew/CreativeSetNew";
import UserList from "../components/Users/UserList/UserList";
import UserNew from "../components/Users/UserNew/UserNew";
import CreativeInstanceNew from "../components/CreativeInstances/CreativeInstanceNew/CreativeInstanceNew";
import CreativeInstanceView from "../containers/Campaigns/CreativeInstanceView/CreativeInstanceView";
import CampaignPerformance from "../containers/Campaigns/CampaignPerformance/CampaignPerformance";

import CampaignView from "../containers/Campaigns/CampaignView/CampaignView";
import CreativeSetView from "../containers/Campaigns/CreativeSetView/CreativeSetView";
import CreativesView from "../containers/Creatives/CreativesView/CreativesView";
import InvoiceView from "../containers/Invoices/InvoicesView/InvoiceView";
import AdvertiserView from "../containers/Users/AdvertiserView/AdvertiserView";
import AdvertiserNew from "../components/Advertisers/AdvertiserNew/AdvertiserNew";
import UserView from "../containers/Users/UserView/UserView";

import Overview from "./views/campaigns/views/campaign/views/analytics/views/overview/Overview";
import Platforms from "./views/campaigns/views/campaign/views/analytics/views/platforms/Platforms";

import * as S from "./Admin.style";
import { styles } from "./Admin.style";

class Admin extends React.Component<any, any> {
    public render(): any {
        const { auth, classes, drawer, match } = this.props;
        if (
            !auth ||
            !auth.signedIn ||
            !auth.emailVerified ||
            auth.role !== "admin"
        ) {
            return <Redirect to="/a" />;
        }
        return (
            <S.Container>
                <AppBar />
                <S.Content>
                    <SideBar type={"admin"} match={match} />
                    <S.Main>
                        <Switch>
                            {/* /dashboard */}
                            <Route path={match.url + "/dashboard"} component={Dashboard} />
                            {/* /users */}
                            <Route exact path={match.url + "/users"} component={UserList} />
                            <Route exact path={match.url + "/users/new"} component={UserNew} />
                            <Route exact path={match.url + "/users/:userId"} component={UserView} />
                            <Route exact path={match.url + "/users/:userId/advertiser/new"} component={AdvertiserNew} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId"} component={AdvertiserView} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/invoice/:invoiceId"}
                                component={InvoiceView} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/campaign/new"}
                                component={CampaignNew} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/campaign/:campaignId"}
                                component={CampaignView} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/campaign/:campaignId/report"}
                                component={CampaignPerformance} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/campaign/:campaignId/analytics/overview"}
                                component={Overview} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/campaign/:campaignId/analytics/platforms"}
                                component={Platforms} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/campaign/:campaignId/creativeSet/new"}
                                component={CreativeSetNew} />
                            <Route exact path={
                                match.url + "/users/:userId/advertiser/:advertiserId/campaign/:campaignId/creativeSet/:creativeSetId"}
                                component={CreativeSetView} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/campaign/:campaignId/creativeSet/:creativeSetId/creativeInstance/new"}
                                component={CreativeInstanceNew} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/campaign/:campaignId/creativeSet/:creativeSetId/creativeInstance/:creativeInstanceId"}
                                component={CreativeInstanceView} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/creative/new"}
                                component={CreativesNew} />
                            <Route exact path={match.url + "/users/:userId/advertiser/:advertiserId/creative/:creativeId"}
                                component={CreativesView} />
                            {/* /campaigns */}
                            <Route path={match.url + "/campaigns"} component={CampaignsList} />
                            <Redirect to={match.url + "/dashboard"} />
                        </Switch>
                    </S.Main>
                </S.Content>
            </S.Container>
        );
    }
}

const mapStateToProps = (state: any, ownProps: any) => ({
    auth: state.authReducer,
    drawer: state.drawerReducer
});

export default withStyles(styles, { withTheme: true })(
    connect(mapStateToProps)(Admin)
);