export interface emailTransaction {
  to: string; // L'email du destinataire
  subject: string; // Sujet de l'email
  text: string; // Contenu de l'email en texte brut
  htmlContent: string; // Contenu de l'email en HTML
}
