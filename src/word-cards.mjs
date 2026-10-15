/**
 * Deterministic state helpers for native tap-to-order word chips.
 * This is a reference model: ChatGPT renders controls and submits the assembled
 * answer through the same trusted lesson Submit. Do not store an answer key here.
 */
const validWord = x => typeof x === 'string' && x.trim().length > 0;
function assertState(state) {
  if (!state || !Array.isArray(state.cards) || !Array.isArray(state.selected_ids) ||
      state.cards.some((card,i)=>card.id!==i || !validWord(card.text)) ||
      state.selected_ids.some((id,i)=>!Number.isInteger(id) ||
        id<0 || id>=state.cards.length || state.selected_ids.indexOf(id)!==i))
    throw new Error('Invalid word card state');
}
export function createWordCardState(words) {
  if (!Array.isArray(words) || words.length<1 || words.length>40 ||
      words.some(x=>!validWord(x))) throw new Error('A valid set of words is required');
  return {cards:words.map((text,id)=>({id,text})),selected_ids:[]};
}
export function selectWordCard(state,cardId) {
  assertState(state);
  if (!Number.isInteger(cardId)||!state.cards.some(card=>card.id===cardId))
    throw new Error('Unknown word card');
  if (state.selected_ids.includes(cardId)) throw new Error('Card already selected');
  return {...state,selected_ids:[...state.selected_ids,cardId]};
}
export function undoWordCard(state) {
  assertState(state);
  return {...state,selected_ids:state.selected_ids.slice(0,-1)};
}
export function resetWordCards(state) {
  assertState(state);
  return {...state,selected_ids:[]};
}
export function assembledWordAnswer(state) {
  assertState(state);
  return state.selected_ids.map(id=>state.cards[id].text.trim()).join(' ')
    .replace(/\s+([,.;:!?])/g,'$1').trim();
}
export function isWordCardComplete(state) {
  assertState(state);
  return state.selected_ids.length===state.cards.length;
}
