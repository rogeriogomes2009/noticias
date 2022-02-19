const labels = [
  { id: 'to-read', name: 'Para Ler'},
  { id: 'reading', name: 'Lendo'},
  { id: 'read', name: 'Lida'},
]
const index = async ({ Noticia }, req, res) => {
  const docs = await Noticia.find({})
  res.render('noticias/index', { noticias: docs , labels })
}

  const novaProcess = async ({ Noticia }, req, res) => {
   const noticia = new Noticia (req.body)
   try{
      await noticia.save()
      res.redirect('/noticias')
  }catch(e){
    res.render('noticias/nova', {
      errors: Object.keys(e.errors)
    })
    }
  }
 
const novaForm = (req, res) => {
  res.render('noticias/nova', { errors: []})
}

const excluir = async ({ Noticia }, req, res) => {
  await Noticia.remove({ _id: req.params.id })
    res.redirect('/noticias')
  }


const editarProcess = async ({ Noticia }, req, res) => {
 const noticia = await Noticia.findOne({ _id: req.params.id})
    noticia.title = req.body.title
    noticia.status = req.body.status
    try{
      await noticia.save()
      res.redirect('/noticias')
    }catch(e){
      res.render('noticias/editar', {noticia, labels, errors: Object.keys(e.errors)}) 
    }
    }


const editarForm = async ({ Noticia }, req, res) => {
  const noticia = await Noticia.findOne({_id: req.params.id})
    res.render('noticias/editar', {noticia, labels, errors: []})
}

const info = async( { Noticia }, req, res) => {
  const noticia = await Noticia.findOne({_id: req.params.id})
  res.render('noticias/info', { noticia })
}

const addComentario = async({ Noticia }, req, res) => {
  await Noticia.updateOne({ _id: req.params.id }, {$push: {comments: req.body.comentario}})
  res.redirect('../info/'+req.params.id)
}

module.exports = {
  index, novaProcess, novaForm, excluir, editarProcess, editarForm, info, addComentario
}