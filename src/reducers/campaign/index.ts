import {
  CREATE_CAMPAIGNS_FAILED,
  CREATE_CAMPAIGNS_START,
  CREATE_CAMPAIGNS_SUCCESSFUL,
  GET_CAMPAIGNS_FAILD,
  GET_CAMPAIGNS_START,
  GET_CAMPAIGNS_SUCCESSFUL,
  ICampaignAction,
  SIGN_OUT,
  UPDATE_CAMPAIGNS_FAILED,
  UPDATE_CAMPAIGNS_START,
  UPDATE_CAMPAIGNS_SUCCESSFUL,
} from "../../actions";

import { createCampaignReducer } from "./campaign.create";
import { getCampaignReducer } from "./campaign.get";
import { ICampaignState } from "./campaign.interface";
import { updateCampaignReducer } from "./campaign.update";

const campaignReducer = (
  state: ICampaignState = {
    campaigns: [],
  },
  action: ICampaignAction,
) => {
  switch (action.type) {
    case GET_CAMPAIGNS_START:
    case GET_CAMPAIGNS_FAILD:
    case GET_CAMPAIGNS_SUCCESSFUL:
      return getCampaignReducer(state, action);
    case UPDATE_CAMPAIGNS_FAILED:
    case UPDATE_CAMPAIGNS_START:
    case UPDATE_CAMPAIGNS_SUCCESSFUL:
      return updateCampaignReducer(state, action);
    case CREATE_CAMPAIGNS_FAILED:
    case CREATE_CAMPAIGNS_START:
    case CREATE_CAMPAIGNS_SUCCESSFUL:
      return createCampaignReducer(state, action);
    case SIGN_OUT:
      return {
        campaigns: [],
      };
    default:
      return state;
  }
};

export default campaignReducer;
